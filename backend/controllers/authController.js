import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    if (!username || !mail || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      mail,
      password: hashedPassword,
    });

    await newUser.save();

    // Generar token por 7 días e incluir role
    const token = jwt.sign(
      { id: newUser._id, mail: newUser.mail, role: newUser.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const existingUser = await User.findOne({ mail });
    if (!existingUser) {
      return res.status(404).json({ message: 'Correo inválido' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Contraseña inválida' });
    }

    // Generar token por 7 días e incluir role
    const token = jwt.sign(
      { id: existingUser._id, mail: existingUser.mail, role: existingUser.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
