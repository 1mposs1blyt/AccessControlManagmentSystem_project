import { getBaseUrl } from "app/utils/util";
import { YStack, H2, Paragraph } from "tamagui";
import { UserList } from "./UserList"

export const AdminDashboard = () => {
  const createUser = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mark@mail.com',
          password: '1234',
          name: 'mark',
          role: 'USER'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Пользователь успешно создан:', data.user);
      } else {
        console.error('❌ Ошибка регистрации:', data.error);
      }
    } catch (err) {
      console.error('🔥 Сетевая ошибка:', err);
    }
  };

  return (
    <>
      <YStack space="$4" p="$4" alignItems="center">
        { /*<Button mb="$4" onPress={() => alert("Заглушка.Запрос в коде!")}>Добавить пользователя</Button>*/}
        {/*<Button mb="$4" onPress={() => createUser()}>Добавить пользователя</Button>*/}
        <H2>Панель администратора</H2>
        <Paragraph>Список всех пользователей системы:</Paragraph>
      </YStack>
      <UserList />
    </>
  )
}