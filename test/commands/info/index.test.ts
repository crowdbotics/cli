import {expect, test} from '@oclif/test'

describe('info', () => {
  test
    .stdout()
    .command(['info'])
    .it('runs info cmd', (ctx) => {
      expect(ctx.stdout).to.contain('hello from Crowdbotics!')
    })
})
