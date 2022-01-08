<script lang="ts">  
   import { GoogleLogin, GoogleLogout, Icon } from 'google-login-svelte'
   import type { GoogleLoginResponse, ProfileObject } from 'google-login-svelte'

   const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
   let user = null as ProfileObject

   const onLogin = ({ detail }: CustomEvent<GoogleLoginResponse>) => {
      user = detail.profileObj
      console.log(`User ${user.name} signed in successfully`)
   }

   const onLogoutSuccess = () => {
      user = null
      console.log('User logged out successfully')
   }

   const onLoginFailure = () => {
      console.error('Failed to sign in')
   }

   const onLogoutFailure = (event: CustomEvent<Error>) => {
      console.error('Failed to sign out', event.detail)
   }
</script>

<main>
   <pre>
      <code>
         user = {user ? JSON.stringify(user, null, 4) : '{}'}
      </code>
   </pre>
   <!-- If there is no user, we show the sign in button -->
   {#if !user}
      <GoogleLogin 
         clientId={googleId}
         on:success={onLogin}
         on:failure={onLoginFailure}
         let:disabled 
         let:signIn
      >
         <button class="signin" on:click={signIn} {disabled}>
            <Icon /> Sign in with Google
         </button>
      </GoogleLogin>
   <!-- Otherwise we show the sign out button -->
   {:else}
      <GoogleLogout 
         clientId={googleId}
         on:success={onLogoutSuccess}
         on:failure={onLogoutFailure}
         let:signOut
         let:disabled
      >
         <button class="signin" on:click={signOut} {disabled}>
            Logout
         </button>
      </GoogleLogout>
   {/if}
</main>

<style>
   :global(html, body) {
      margin: 0;
      padding: 0;
   }

   main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #333;
      width: 100vw;
      height: 100vh;
      font-family: -apple-system, 'Segoe UI', sans-serif;
   }

   button {
      font-weight: 500;
      padding: 1rem 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border: none;
      outline: none;
      background: #fff;
      color: #222;
      cursor: pointer;
   }

   button:disabled {
      opacity: .5;
      cursor: default;
   }
</style>