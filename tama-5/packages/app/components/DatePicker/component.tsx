'use client'
import { useState } from 'react'
import { Button, Popover, XStack, YStack, SizableText } from 'tamagui'
import { Calendar } from '@tamagui/lucide-icons' // если нужны иконки

export function MyDatePicker({ onDateChange }: { onDateChange: (d: Date) => void }) {
    return (
        <XStack space="$2" p="$4">
            <Button onPress={() => onDateChange(new Date())}>Сегодня</Button>
            <Button onPress={() => {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                onDateChange(yesterday)
            }}>Вчера</Button>
        </XStack>
    )
}
