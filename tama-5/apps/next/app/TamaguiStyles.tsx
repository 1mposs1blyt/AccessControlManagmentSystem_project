'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native-web'
import config from '@app/ui/src/tamagui.config'

export const TamaguiStyles = () => {
  useServerInsertedHTML(() => {
    const styles = config.getCSS() 
    const sheet = StyleSheet.getSheet()
    
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} id="t-css" />
        <style dangerouslySetInnerHTML={{ __html: sheet.textContent }} id="rnw-css" />
      </>
    )
  })

  return null
}
