import test from 'node:test'
import assert from 'node:assert/strict'
import { pickHeader, toCents } from './csv-utils'

test('pickHeader matches headers regardless of case or spacing', () => {
  const row = { 'Post Date': '07/01/2025' }
  assert.equal(pickHeader(row, ['post-date']), '07/01/2025')
})

test('pickHeader returns empty string when header present but value blank', () => {
  const row = { 'Post Date': '', Amount: '10' }
  assert.equal(pickHeader(row, ['Post Date']), '')
})

test('pickHeader returns undefined when no candidates match', () => {
  const row = { Description: 'foo' }
  assert.equal(pickHeader(row, ['Amount']), undefined)
})

test('toCents parses basic numbers', () => {
  assert.equal(toCents('1,234.56'), 123456)
})

test('toCents parses negative numbers with leading minus', () => {
  assert.equal(toCents('-1,234.56'), -123456)
})

test('toCents parses negative numbers with trailing minus', () => {
  assert.equal(toCents('1,234.56-'), -123456)
})

test('toCents parses negatives wrapped in parentheses', () => {
  assert.equal(toCents('(1,234.56)'), -123456)
})

test('toCents strips currency symbols', () => {
  assert.equal(toCents('$1,234.56'), 123456)
})

test('toCents returns 0 for undefined', () => {
  assert.equal(toCents(undefined), 0)
})
