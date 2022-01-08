
export const loadScript = async (src: string, id: string): Promise<void> => {
   let script = document.getElementById(id) as HTMLScriptElement

   if (!script) {
      script = document.createElement('script')
      script.id = id
      script.src = src
      document.body.appendChild(script)
   }
   
   return new Promise((resolve, reject) => {
      script.onload = () => resolve()
      script.onerror = (e) => {
         document.body.removeChild(script)
         reject(e)
      }
   })
}

export const removeScript = (id: string): void => {
   const script = document.getElementById(id)
   script && script.parentNode.removeChild(script)
}