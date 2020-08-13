import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import db from '../database/connection';

export default class LoginControllers {
    async authenticate(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            const user = await db('users').first('*').where({ email });
            if (user) {
                const validPass = await bcrypt.compare(password, user.hash);

                const token = jwt.sign({ user: user.email }, "secret", {expiresIn: 86400});

                validPass ? res.status(200).json({...user, token})
                    : res.status(400).json({ error: "Invalid password" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (err) {
            return res.status(400).json({ error: "User authentication failed" });
        }
    }
}
