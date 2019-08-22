import React from 'react'
import { loremIpsum } from 'lorem-ipsum'
import Alea from 'alea'
import { Text, View } from '@databyss-org/ui/primitives'
import Grid from '@databyss-org/ui/components/Grid/Grid'
import { Section } from './'

const alea = new Alea('views')
const ipsum = loremIpsum({ units: 'sentences', count: 4, random: alea })

const CaptionedView = ({ caption, children, ...others }) => (
  <View height={180} width={240} {...others}>
    {children}
    <Text variant="uiTextNormalSemibold">{caption}</Text>
  </View>
)

export default () => (
  <React.Fragment>
    <Section title="Border variants">
      <Grid mb="medium">
        <CaptionedView caption="none">
          <View borderVariant="none" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
        <CaptionedView caption="thinDark">
          <View borderVariant="thinDark" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
        <CaptionedView caption="thinLight">
          <View borderVariant="thinLight" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
      </Grid>
    </Section>
    <Section title="Padding variants">
      <Grid mb="medium">
        <CaptionedView caption="none">
          <View borderVariant="thinLight" paddingVariant="none" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
        <CaptionedView caption="small">
          <View borderVariant="thinLight" paddingVariant="small" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
        <CaptionedView caption="medium">
          <View borderVariant="thinLight" paddingVariant="medium" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
        <CaptionedView caption="large">
          <View borderVariant="thinLight" paddingVariant="large" mb="small">
            <Text variant="uiTextNormal">{ipsum}</Text>
          </View>
        </CaptionedView>
      </Grid>
    </Section>
  </React.Fragment>
)