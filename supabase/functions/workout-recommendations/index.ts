import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    console.log('Generating workout recommendations for user:', user.id);

    // Get user profile and workout history
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: workoutHistory } = await supabase
      .from('user_workouts')
      .select(`
        *,
        workouts (
          title,
          category,
          difficulty,
          duration_minutes
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    const { data: allWorkouts } = await supabase
      .from('workouts')
      .select('*');

    // Get request preferences
    const { preferences = {}, count = 3 } = await req.json();

    // Prepare context for AI
    const userContext = {
      profile: {
        experience_points: profile?.experience_points || 0,
        current_streak: profile?.current_streak || 0,
        total_workouts: profile?.total_workouts || 0,
        rank_level: profile?.rank_level || 1
      },
      recentWorkouts: workoutHistory?.slice(0, 5).map(w => ({
        category: w.workouts?.category,
        difficulty: w.workouts?.difficulty,
        duration: w.duration_minutes,
        completedAt: w.completed_at
      })) || [],
      preferences: {
        difficulty: preferences.difficulty || 'beginner',
        duration: preferences.duration || 30,
        categories: preferences.categories || [],
        goals: preferences.goals || 'general fitness'
      }
    };

    const availableWorkouts = allWorkouts?.map(w => ({
      id: w.id,
      title: w.title,
      category: w.category,
      difficulty: w.difficulty,
      duration: w.duration_minutes,
      description: w.description
    })) || [];

    const prompt = `You are a professional fitness trainer AI. Based on the user's profile and preferences, recommend ${count} specific workouts from the available options.

User Profile:
- Experience Points: ${userContext.profile.experience_points}
- Current Streak: ${userContext.profile.current_streak} days
- Total Workouts: ${userContext.profile.total_workouts}
- Rank Level: ${userContext.profile.rank_level}

Recent Workout History:
${userContext.recentWorkouts.map(w => `- ${w.category} (${w.difficulty}) - ${w.duration} mins`).join('\n')}

User Preferences:
- Preferred Difficulty: ${userContext.preferences.difficulty}
- Preferred Duration: ${userContext.preferences.duration} minutes
- Preferred Categories: ${userContext.preferences.categories.join(', ') || 'any'}
- Fitness Goals: ${userContext.preferences.goals}

Available Workouts:
${availableWorkouts.map(w => `- ID: ${w.id}, Title: ${w.title}, Category: ${w.category}, Difficulty: ${w.difficulty}, Duration: ${w.duration} mins, Description: ${w.description}`).join('\n')}

Please recommend exactly ${count} workouts that best match the user's profile and preferences. Consider their experience level, recent activity patterns, and stated preferences. Provide variety while staying within their comfort zone.

Respond with a JSON array of objects, each containing:
- id: the workout ID from the available workouts
- reason: a brief explanation (max 100 chars) of why this workout is recommended for this user
- priority: number from 1-3 (1 = highest priority)

Example format:
[
  {
    "id": "workout-id-here",
    "reason": "Perfect intensity for your current streak and builds on recent strength training",
    "priority": 1
  }
]`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional fitness trainer AI that provides personalized workout recommendations.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse AI response
    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic recommendations
      recommendations = availableWorkouts.slice(0, count).map((workout, index) => ({
        id: workout.id,
        reason: `Recommended based on your fitness level`,
        priority: index + 1
      }));
    }

    // Get full workout details for recommendations
    const recommendedWorkouts = recommendations.map((rec: any) => {
      const workout = availableWorkouts.find(w => w.id === rec.id);
      return {
        ...workout,
        reason: rec.reason,
        priority: rec.priority
      };
    }).filter(Boolean);

    console.log('Generated workout recommendations:', recommendedWorkouts.length);

    return new Response(JSON.stringify({
      recommendations: recommendedWorkouts,
      userContext: {
        totalWorkouts: userContext.profile.total_workouts,
        currentStreak: userContext.profile.current_streak,
        rankLevel: userContext.profile.rank_level
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in workout-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate workout recommendations'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});