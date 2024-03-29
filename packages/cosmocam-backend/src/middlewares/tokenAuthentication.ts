import jwt from "jsonwebtoken";

const authenticateAccessToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      req.body.user = user;

      next();
    }
  );
};

export const tokenAuthenticationMiddleware = { authenticateAccessToken };
