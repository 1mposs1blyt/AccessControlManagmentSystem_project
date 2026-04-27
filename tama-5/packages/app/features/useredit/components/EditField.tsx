import { XStack, YStack, Label, SizableText, Input } from "tamagui";

export const EditField = ({ label, field, currentValue, isPassword = false, formData, setFormData }: any) => (
    <YStack space="$1" width="100%" maxWidth={400}>
        <XStack jc="space-between" ai="center">
            <Label size="$2" theme="alt1">{label}:</Label>
            <SizableText size="$2" color="$colorFocus">
                {isPassword ? "********" : (currentValue || '—')}
            </SizableText>
        </XStack>
        <Input
            size="$3"
            secureTextEntry={isPassword}
            value={formData[field] || ''}
            onChangeText={(text: string) => setFormData({ ...formData, [field]: text })}
            placeholder={`Новое значение...`}
            bw={1}
            bc="$borderColor"
            bg="$background"
            color="$color"
            focusStyle={{
                bc: "$blue10",
                bw: 2
            }}
            placeholderTextColor="$gray10"
        />
    </YStack>
)