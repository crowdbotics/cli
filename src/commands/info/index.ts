import {Command} from '@oclif/core'

export default class Hello extends Command {
  static args = {}

  static description = 'Hello from the Crowdbotics CLI'

  static examples = [
    `$ crowdbotics-cli info
hello from Crowdbotics!
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    this.log(`hello from Crowdbotics!`)
  }
}
