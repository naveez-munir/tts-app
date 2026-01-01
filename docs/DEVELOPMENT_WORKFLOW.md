# DEVELOPMENT WORKFLOW & BEST PRACTICES

---

## Git Workflow

### Branch Naming
- `feature/booking-flow`
- `fix/payment-validation`
- `refactor/api-responses`

### Commit Messages
Format: `type(scope): description`

Examples:
- `feat(booking): add quote calculation`
- `fix(auth): resolve token expiration`

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Testing Requirements

### Backend (Jest + Supertest)
- Unit tests for services and utilities
- Integration tests for API endpoints
- Test coverage: 70%+ for critical paths

### Frontend (React Testing Library)
- Component tests for UI
- Integration tests for forms and flows
- E2E tests (Playwright/Cypress) - optional for MVP
- Test coverage: 60%+ for critical components

---

## Code Review Checklist

- [ ] TypeScript strict mode (no `any`)
- [ ] Zod validation for all inputs
- [ ] Error handling (try-catch, error boundaries)
- [ ] Loading and error states in UI
- [ ] Responsive design tested
- [ ] Accessibility (keyboard nav, ARIA, contrast)
- [ ] No hardcoded values (use env vars)
- [ ] No sensitive data in logs
- [ ] Database queries optimized
- [ ] API responses follow standard format
- [ ] Proper HTTP status codes
- [ ] Auth/authz checks in place
- [ ] Input sanitization (XSS/SQL injection)
- [ ] Rate limiting on sensitive endpoints

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Auto deployments on push to main
4. Preview deployments for PRs

### Backend (Railway/Render)
1. Connect GitHub repo
2. Configure environment variables
3. Set up PostgreSQL and Redis add-ons
4. Build command: `npm run build`
5. Start command: `npm run start:prod`
6. Health check: `GET /health`

### Database Migrations
- Run `npx prisma migrate deploy` in production
- Never run `prisma migrate dev` in production
- Test migrations in staging first

---

## Monitoring & Logging

- Structured logging (Winston or Pino)
- Log levels: error, warn, info, debug
- Never log sensitive data
- Error tracking (Sentry) - optional for MVP
- Monitor API response times and error rates

