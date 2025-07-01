import { Request, Response, NextFunction } from 'express';
import  jwt  from 'jsonwebtoken';
import { supabase } from '../connection/supabaseClient'; 

const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
      res.status(400).json({ error: 'Email or username and password are required' });
      return;
    }

    let userEmail = email;

    // If username provided instead of email, look up email by username in your users table
    if (!email && username) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single();

      if (usersError || !usersData) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      userEmail = usersData.email;
    }

    // Now sign in with the resolved email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail!,
      password,
    });

    if (error || !data || !data.user) {
      res.status(401).json({ error: error?.message || 'Login failed' });
      return;
    }

    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || '',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', err });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({ error: 'Email, password, and username are required' });
      return;
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // store custom fields
        },
      },
    });

    if (error || !data.user) {
      res.status(400).json({ error: error?.message || 'Registration failed' });
      return;
    }

    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || '',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const favoriteRepo = async (
  req: Request & {user?: {id: string}},
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const  userId  = req.user?.id; // Get user_id from URL
    const { name, description, starCount, link, language } = req.body;

    // Basic validation
    if (!name || !link || !userId) {
      res.status(400).json({ error: 'name, link, and userId are required' });
      return;
    }

    const { data, error } = await supabase
      .from('favorite_repos')
      .insert([
        {
          name,
          description,
          star_count: starCount || 0,
          link,
          language,
          user_id: userId, // Use userId from URL
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({
      message: 'Repo added to favorites',
      repo: data[0],
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Server error adding favorite repo' });
  }
};

export const getFavoriteRepo = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: missing user ID' });
        return;
      }
  
      const { data, error } = await supabase
        .from('favorite_repos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Supabase fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch favorite repositories' });
        return;
      }
  
      res.status(200).json({
        message: 'Favorite repositories retrieved successfully',
        repos: data,
      });
    } catch (err) {
      console.error('Unexpected error in getFavoriteRepo:', err);
      res.status(500).json({ error: 'Server error retrieving favorite repositories' });
    }
  };