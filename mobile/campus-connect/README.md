# Campus Connect — React Native (Expo) frontend

A mobile frontend for the Campus Connect backend: college-email auth,
profile setup, events, lost & found (with photo upload), notes/resources
(file or link), and an admin panel for user management.

## 1. Apply the backend patch

See `BACKEND_CHANGES.md` — a few lines in `auth.controller.js` and
`auth.middleware.js` so the app can use `Authorization: Bearer` tokens
instead of relying on a browser cookie jar.

## 2. Point the app at your backend

Edit `src/api/client.js`:

```js
export const BASE_URL = "http://192.168.1.20:3000"; // <- your machine's LAN IP
```

- **Physical phone in Expo Go**: use your computer's LAN IP (find it with
  `ipconfig` / `ifconfig`), not `localhost`. Phone and computer must be on
  the same Wi-Fi network.
- **Android emulator**: use `http://10.0.2.2:<port>`.
- **iOS simulator**: `http://localhost:<port>` works.

## 3. Install and run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press
`a` / `i` for an emulator/simulator.

## Project structure

```
src/
  api/           axios client + one file per resource (auth, events, lostFound, notes, admin)
  context/       AuthContext — session, token storage, current user
  navigation/    RootNavigator (auth vs profile-setup vs app), AppTabs (bottom tabs), AuthStack
  screens/       one folder per feature area
  components/    Button, Input, Card, EmptyState, LoadingSpinner
  theme/         colors, spacing, radius
```

## Notes on how it maps to your backend

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`. Email must end
  in `iiitg.ac.in` (enforced both client- and server-side).
- **Profile**: new users see a one-time setup screen that calls
  `PUT /users/complete-profile`, gated on `user.profileCompleted`.
- **Events**: `GET/POST/PATCH/DELETE /events`. Create/edit/delete are only
  shown to `role === "admin"` users, matching your `adminMiddleware`.
- **Lost & Found**: `GET/POST /lost-found`, `GET /lost-found/my-posts`,
  `GET/PUT /lost-found/:id`. Image upload uses `multipart/form-data` to
  match `upload.middleware.js` (field name `image`).
- **Notes**: `GET/POST /resources`, `GET /resources/:id`, with search/filter
  query params (`search`, `courseId`, `semester`, `resourceType`). File
  upload matches `resourceUpload.middleware.js` (field name `file`).
- **Admin**: `GET /admin/users`, `PATCH /admin/users/:id/block`,
  `PATCH /admin/users/:id/unblock`.

## Known gaps to double check against your backend

- `lostAndFound.controller.js`'s `updatePost` has a small bug — it sets
  `report.location = req.body.description` instead of
  `req.body.location`. The app sends `location` correctly; you may want to
  fix that line server-side.
- `notes.model.js`'s conditional-required checks compare against the
  literal strings `'file;'` / `'link;'` (with a stray semicolon), so they
  never actually enforce `fileUrl`/`externalLink` as required. Not
  something the frontend needs to work around, just worth knowing.
- The lost-and-found `GET /:id` and notes `GET /resources` routes require
  auth (`requireAuth`) in your routes — the app already sends the bearer
  token on every request, so this works, but it does mean logged-out users
  can't view details/resources (they can still see the trimmed list where
  the route allows it).
