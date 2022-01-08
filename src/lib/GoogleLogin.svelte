<script context="module" lang="ts">
   import { onMount, createEventDispatcher } from 'svelte'
   import { loadScript, removeScript } from './utils'

   export interface AuthResponse {
      readonly access_token: string
      readonly id_token: string
      readonly login_hint: string
      readonly scope: string
      readonly expires_in: number
      readonly first_issued_at: number
      readonly expires_at: number
   }

   export interface BasicProfile {
      getId(): string
      getEmail(): string
      getName(): string
      getGivenName(): string
      getFamilyName(): string
      getImageUrl(): string
   }

   export interface ProfileObject {
      googleId: string
      imageUrl: string
      email: string
      name: string
      givenName: string
      familyName: string
   }

   export interface GoogleLoginResponse {
      getBasicProfile(): BasicProfile
      getAuthResponse(includeAuthorizationData?: boolean): AuthResponse
      reloadAuthResponse(): Promise<AuthResponse>
      getGrantedScopes(): string
      getHostedDomain(): string
      getId(): string
      isSignedIn(): boolean
      hasGrantedScopes(scopes: string): boolean
      disconnect(): void
      grantOfflineAccess(options: GrantOfflineAccessOptions): Promise<GoogleLoginResponseOffline>
      signIn(options: SignInOptions): Promise<any>
      grant(options: SignInOptions): Promise<any>
      // google-login.js sez: offer renamed response keys to names that match use
      googleId: string
      tokenObj: AuthResponse
      tokenId: string
      accessToken: string
      readonly code?: string //does not exist but here to satisfy typescript compatibility
      profileObj: ProfileObject
   }

   export interface GrantOfflineAccessOptions {
      readonly scope?: string;
      readonly redirect_uri?: string;
   }

   export interface SignInOptions {
      readonly scope?: string;
      readonly app_package_name?: string;
      readonly fetch_basic_profile?: boolean;
      readonly prompt?: string;
   }

   export interface GoogleLoginResponseOffline {
      readonly code: string;
   }
</script>

<script lang="ts">
   export let clientId: string
   export let scope = 'profile email'
   export let redirectUri: string = undefined
   export let cookiePolicy = 'single_host_origin'
   export let loginHint: string = undefined
   export let hostedDomain: string = undefined
   export let prompt = ''
   export let responseType: string = undefined
   export let autoLoad: boolean = undefined
   export let uxMode = 'popup'
   export let fetchBasicProfile = true
   export let isSignedIn = false
   export let discoveryDocs: object = undefined
   export let accessType = 'online'
   export let script = 'https://apis.google.com/js/api.js'

   const dispatch = createEventDispatcher()
   let loaded = false

   const handleSignInSuccess = (res: GoogleLoginResponse) => {
      const basicProfile = res.getBasicProfile()
      const authResponse = res.getAuthResponse(true)

      res.googleId = basicProfile.getId()
      res.tokenObj = authResponse
      res.accessToken = authResponse.access_token
      res.profileObj = {
         googleId: basicProfile.getId(),
         imageUrl: basicProfile.getImageUrl(),
         email: basicProfile.getEmail(),
         name: basicProfile.getName(),
         givenName: basicProfile.getGivenName(),
         familyName: basicProfile.getFamilyName(),
      }
      dispatch('success', res)
   }

   const signIn = (e?: Event) => {
      if (e) e.preventDefault()

      if (loaded) {
         const GoogleAuth = window.gapi.auth2.getAuthInstance()
         const options = { prompt }
         dispatch('request')

         if (responseType === 'code')
            GoogleAuth.grantOfflineAccess(options).then(
               (res) => dispatch('success', res),
               (err) => dispatch('failure', err)
            )
         else
            GoogleAuth.signIn(options).then(
               (res) => handleSignInSuccess(res),
               (err) => dispatch('failure', err)
            )
      }
   }

   onMount(() => {
      let unmounted = false
      
      loadScript(script, 'google-login')
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

            if (responseType === 'code') {
               params.access_type = 'offline'
            }

            window.gapi.load('auth2', () => {
               const GoogleAuth = window.gapi.auth2.getAuthInstance()
               if (!GoogleAuth) {
                  window.gapi.auth2.init(params).then(
                     (res) => {
                        if (!unmounted) {
                           loaded = true
                           const signedIn = isSignedIn && res.isSignedIn.get()
                           dispatch('autoLoadFinished', signedIn)
                           if (signedIn) {
                              handleSignInSuccess(res.currentUser.get())
                           }
                        }
                     },
                     (err) => {
                        loaded = true
                        dispatch('autoLoadFinished', false)
                        dispatch('failure', err)
                     }
                  )
               } else {
                  GoogleAuth.then(
                     () => {
                        if (unmounted) return
                        if (isSignedIn && GoogleAuth.isSignedIn.get()) {
                           loaded = true
                           dispatch('autoLoadFinished', true)
                           handleSignInSuccess(GoogleAuth.currentUser.get())
                        } else {
                           loaded = true
                           dispatch('autoLoadFinished', false)
                        }
                     },
                     (err) => dispatch('failure', err)
                  )
               }
            })
         })
         .catch((err) => dispatch('failure', err))

      return () => {
         unmounted = true
         removeScript('google-login')
      }
   })

   const onLoadedChange = (loaded: boolean) => {
      if (autoLoad)
         signIn()
   }

   $: onLoadedChange(loaded)
</script>

<slot {signIn} disabled={!loaded}></slot>