# google-login-svelte

This is a simple [svelte](https://svelte.dev) component that allows the user to **sign in** with Google.
Essentially, this is the *svelte* version of the [react-google-login](https://github.com/anthonyjgrove/react-google-login)
package.

## Getting Started

### Installation

Install with npm

```bash
npm install google-login-svelte
```

### Basic usage

```svelte
<script>
   import { GoogleLogin } from 'google-login-svelte'

   let user = null

   const handleSignin = (event) => {
      user = event.detail.profileObj
      console.log(`User ${user.name} signed in successfully`)
   }

   const handleFailure = (event) => {
      const err = event.detail
      console.error(`Error while signing in: `, err)
   }
</script>

<GoogleLogin 
   clientId={process.env.YOUR_CLIENT_ID}
   on:success={handleSignin}
   on:failure={handleFailure}
   let:signIn
>
   <button on:click={signIn}>
      Sign in with Google
   </button>
</GoogleLogin>

{#if user}
   <h1>Welcome {user.name}</h1>
{/if}
```

### With typescript

```svelte
<script lang="ts">
   import { GoogleLogin } from 'google-login-svelte'
   import type { GoogleLoginResponse } from 'google-login-svelte'

   let user = null

   const handleSignin = (event: CustomEvent<GoogleLoginResponse>) => {
      user = event.detail.profileObj
      console.log(`User ${user.name} signed in successfully`)
   }

   const handleFailure = (event: CustomEvent) => {
      const err = event.detail
      console.error(`Error while signing in: `, err)
   }
</script>

<GoogleLogin 
   clientId={process.env.YOUR_CLIENT_ID}
   on:success={handleSignin}
   on:failure={handleFailure}
   let:signIn
>
   <button on:click={signIn}>
      Sign in with Google
   </button>
</GoogleLogin>

{#if user}
   <h1>Welcome {user.name}</h1>
{/if}
```

## License

MIT License

Copyright (c) 2022 Jorge Pereira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.