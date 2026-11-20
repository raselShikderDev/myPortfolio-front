# Testing Documentation

## Current Setup

### Testing Framework
- **Test Runner**: Vitest (configured)
- **Environment**: Bun's built-in test runner
- **Coverage**: Not yet running on the Vitest setup

### Test Files Created

#### Core Configuration
- `vitest.config.ts` - Vitest configuration with TypeScript support
- `src/test-utils/setup.ts` - Global test setup
- `src/test-utils/index.ts` - Test utilities

#### Test Examples
- `tests/simple.test.ts` - Basic test examples (passing ✅)
- `tests/components/button.test.tsx` - Button component tests
- `tests/components/input.test.tsx` - Input component tests
- `tests/lib/sanitizeBlogContent.test.ts` - Utility function tests (existing)
- `tests/lib/apiConfig.test.ts` - API config tests (existing)
- `tests/lib/apiHelper.test.ts` - API helper tests (existing)
- `tests/zodSchema/*.test.ts` - Zod schema tests (existing)

## Testing Strategy

### Phase 1: Foundation ✅ In Progress
- [x] Set up Vitest configuration
- [x] Create test utilities
- [x] Add basic tests
- **Status**: Partially complete - component tests need React setup

### Phase 2: Expansion
- [ ] Add integration tests with MSW
- [ ] Add E2E tests with Playwright
- [ ] Add coverage reporting
- [ ] Set up CI/CD integration

### Phase 3: Optimization
- [ ] Add visual regression testing
- [ ] Add accessibility testing
- [ ] Add performance testing
- [ ] Add security testing

## Running Tests

### Current Setup (Bun)
```bash
bun test
```

### Vitest Setup
```bash
# Run tests
npx vitest run

# Watch mode
npx vitest

# Run tests with coverage
npx vitest run --coverage
```

## Next Steps

1. Fix React Testing Library setup for component tests
2. Add MSW for API mocking
3. Set up Playwright for E2E tests
4. Add GitHub Actions CI/CD

## Notes

- Component tests have environment setup issues that need resolution
- Utility and schema tests are working well
- Plan and tasks are documented in `tasks/plan.md`