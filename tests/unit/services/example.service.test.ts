import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppError } from '@/lib/errors'

// Example service test showing the patterns for the codebase

type MockDb = {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
  }
}

const mockDb: MockDb = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}

vi.mock('@/lib/db', () => ({
  db: mockDb,
}))

// Example function to test (would normally be in lib/services/)
async function getUserById(id: string) {
  const user = await mockDb.user.findUnique({ where: { id } })
  if (!user) throw AppError.notFound('User')
  return user
}

async function createUser(name: string, email: string) {
  const existing = await mockDb.user.findUnique({ where: { email } })
  if (existing) throw new AppError('CONFLICT', 'User already exists', 409)
  return mockDb.user.create({ data: { name, email } })
}

describe('getUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a user when found', async () => {
    const fakeUser = { id: '1', name: 'Alice', email: 'alice@test.com' }
    mockDb.user.findUnique.mockResolvedValue(fakeUser)

    const result = await getUserById('1')
    expect(result).toEqual(fakeUser)
    expect(mockDb.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } })
  })

  it('throws AppError NOT_FOUND when user does not exist', async () => {
    mockDb.user.findUnique.mockResolvedValue(null)

    await expect(getUserById('999')).rejects.toThrow(AppError)
    await expect(getUserById('999')).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 })
  })
})

describe('createUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a user when email is unique', async () => {
    mockDb.user.findUnique.mockResolvedValue(null)
    const fakeUser = { id: '2', name: 'Bob', email: 'bob@test.com' }
    mockDb.user.create.mockResolvedValue(fakeUser)

    const result = await createUser('Bob', 'bob@test.com')
    expect(result).toEqual(fakeUser)
    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: { name: 'Bob', email: 'bob@test.com' },
    })
  })

  it('throws CONFLICT when email already exists', async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: '1', name: 'Existing', email: 'dup@test.com' })

    await expect(createUser('Dup', 'dup@test.com')).rejects.toMatchObject({
      code: 'CONFLICT',
      statusCode: 409,
    })
  })
})
