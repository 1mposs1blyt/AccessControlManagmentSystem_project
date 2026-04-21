import { YStack, H2, Paragraph, SizableText } from "tamagui";

export const UserHome = () => (
  <YStack space="$4" p="$4" ai="center">
    <H2>Мой пропуск</H2>
    <Paragraph>Ваш QR-код для прохода:</Paragraph>
    <YStack bw={2} p="$4" br="$4">
      {/* Здесь будет QR */}
      <SizableText>QR CODE PLACEHOLDER</SizableText>
    </YStack>
  </YStack>
)