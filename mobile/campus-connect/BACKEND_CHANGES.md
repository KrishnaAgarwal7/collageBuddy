# Backend change required

Your Express backend currently sends the JWT only as an httpOnly cookie:

```js
res.cookie("jwt", token, { httpOnly: true, maxAge: maxTime * 1000 });
```

React Native has no browser cookie jar, so the app can't read or resend that
cookie automatically. The fix is small: **also return the token in the JSON
body**, and accept it back either as a cookie *or* as an
`Authorization: Bearer <token>` header. The cookie-based flow keeps working
for any existing web frontend, so this is additive, not a breaking change.

## 1. `auth.controller.js`

In `signup_post`, change:

```js
res.status(201).json({user: user._id, message: "User created successfully"});
```

to:

```js
res.status(201).json({ user: user._id, token, message: "User created successfully" });
```

In `login_post`, change:

```js
res.status(200).json({
  user: user._id,
  profileCompleted: user.profileCompleted,
  message: "User logged in successfully"
});
```

to:

```js
res.status(200).json({
  user: user._id,
  token,
  profileCompleted: user.profileCompleted,
  message: "User logged in successfully"
});
```

## 2. `auth.middleware.js`

Make `requireAuth` accept the token from either the cookie or an
`Authorization: Bearer` header:

```js
const requireAuth = (req, res, next) => {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    const token = req.cookies.jwt || bearer;

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        // ...unchanged from here
    });
};
```

That's it — every other route, controller, and model stays exactly as it is.
The React Native app (in this project) stores the returned `token` with
`expo-secure-store` and sends it as `Authorization: Bearer <token>` on every
request, via `src/api/client.js`.

## 3. CORS (only matters if you keep a web frontend too)

Your current CORS config locks `origin` to `http://127.0.0.1:5500`. That's
irrelevant to the mobile app since RN doesn't have CORS at all, so no change
is needed there. Leave it as-is for the web frontend.
