import {Args, Command, ux} from '@oclif/core'

export default class Login extends Command {
  static args = {
    file: Args.string({description: 'file to read'}),
  }

  static description = ''

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {}

  public async run(): Promise<void> {
    const email = await ux.prompt('Email Address:')
    const password = await ux.prompt('Password:', {type: 'mask'})

    const response = await fetch('https://cbdash-pr-4426.herokuapp.com/api/v2/login/', {
      body: `{"email":"${email}","password":"${password}"}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    this.log('response: ' + JSON.stringify(await response.json()))
  }
}
