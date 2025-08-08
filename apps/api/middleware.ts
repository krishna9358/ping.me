import type { Request, Response, NextFunction   } from "express";
import jwt from "jsonwebtoken";

// export function authMiddleware (req: Request, res: Response, next: NextFunction){
//     const token = req.headers.authorization?.split(" ")[1];
//     if ( !token ){
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//     }
//     try {
//         let data =jwt.verify(token, process.env.JWT_SECRET!);
//         req.userId = data.sub as string;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Unauthorized" });
//     }
// }

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET!);
        req.userId = data.sub as string;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}