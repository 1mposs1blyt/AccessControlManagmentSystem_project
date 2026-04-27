import { YStack, Label, Input } from "tamagui";

export const CreateField = ({ label, field, isPassword = false, formData, setFormData }: any) => (
    <YStack space="$1" width="100%" maxWidth={400}>
        <Label size="$2" theme="alt1">{label}</Label>
        <Input
            size="$3"
            secureTextEntry={isPassword}
            value={formData[field] || ''}
            onChangeText={(text: string) => setFormData({ ...formData, [field]: text })}
            placeholder={`Введите ${label.toLowerCase()}...`}
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