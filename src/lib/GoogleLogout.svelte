<script lang="ts">
   import { onMount, createEventDispatcher } from 'svelte'
   import { loadScript, removeScript } from './utils'

   interface GoogleLogoutEvents {
      success: any
      failure: any
   }
   
   export let clientId: string
   export let scope = 'profile email'
   export let redirectUri: string = undefined
   export let cookiePolicy = 'single_host_origin'
   export let loginHint: string = undefined
   export let hostedDomain: string = undefined
   export let uxMode = 'popup'
   export let fetchBasicProfile = true
   export let discoveryDocs: object = undefined
   export let accessType = 'online'
   export let script = 'https://apis.google.com/js/api.js'

   const dispatch = createEventDispatcher<GoogleLogoutEvents>()
   let loaded = false

   const signOut = () => {
    if (window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance()
      if (auth2 != null) {
        auth2.then(
          () => {
            auth2.signOut().then(() => {
              auth2.disconnect()
              dispatch('success')
            })
          },
          err => dispatch('failure')
        )
      }
    }
  }

   onMount(() => {     
      loadScript(script, 'google-login-2')
         .then(() => {
            const params = {
               client_id: clientId,
               cookie_policy: cookiePolicy,
               login_hint: loginHint,
               hosted_domain: hostedDomain,
               fetch_basic_profile: fetchBasicProfile,
               discoveryDocs,
               ux_mode: uxMode,
               redirect_uri: redirectUri,
               scope,
               access_type: accessType
            }

            window.gapi.load('auth2', () => {
               if (!window.gapi.auth2.getAuthInstance()) {
                  window.gapi.auth2.init(params).then(
                     () => loaded = true,
                     (err) => dispatch('failure', err)
                  )
               } else {
                  loaded = true
               }
            })
         }
      ).catch(err => dispatch('failure', err))

      return () => removeScript('google-login-2')
   })
</script>

<slot {signOut} disabled={!loaded}></slot>