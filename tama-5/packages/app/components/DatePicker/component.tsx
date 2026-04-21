'use client'
import React from 'react'
import { Button, XStack, YStack, View, SizableText } from 'tamagui'
import { Calendar, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'

export function MyDatePicker({ currentDate, onDateChange }: { currentDate: Date, onDateChange: (d: Date) => void }) {
  
  // Функция для быстрого переключения дней (назад/вперед)
  const shiftDate = (amount: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + amount)
    onDateChange(d)
  }

  return (
    <YStack ai="center" space="$2" p="$2">
      <XStack ai="center" space="$2">
        {/* Кнопка "День назад" */}
        <Button 
          circular 
          size="$4" 
          icon={ChevronLeft} 
          onPress={() => shiftDate(-1)} 
          hoverStyle={{ scale: 1.1 }}
          theme="blue"
        />

        <View pos="relative">
          <Button 
            icon={Calendar} 
            minWidth={180} 
            size="$4"
            theme="blue"
          >
            {currentDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long',
              year: currentDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
            })}
          </Button>
          {Platform.OS === 'web' && (
            <input
              type="date"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%'
              }}
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                if (!isNaN(newDate.getTime())) onDateChange(newDate)
              }}
            />
          )}
        </View>
        <Button 
          circular 
          size="$4" 
          theme="blue"
          icon={ChevronRight} 
          onPress={() => shiftDate(1)}
          hoverStyle={{ scale: 1.1 }}
        />
      </XStack>
      <XStack space="$2">
        <Button 
          size="$2" 
          chromeless 
          onPress={() => onDateChange(new Date())}
        >
          Вернуться на сегодня
        </Button>
      </XStack>
    </YStack>
  )
}
