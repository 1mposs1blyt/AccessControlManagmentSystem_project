'use client'
import { YStack, Button, H2, Paragraph } from "tamagui";
import { UserList } from "./components/UserList"
import { getBaseUrl } from "app/utils/util";

export const AdminScreen = () => {
    const createUser = async (email: string, password: string, name: string, role: "USER" | "ADMIN") => {
        try {
            const response = await fetch(`${getBaseUrl()}/api/auth/signup`, {
                method: 'POST',
                cache: 'no-store',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                    role: role
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
    return <UserList />
    // return (
    //     <>
    //         <YStack space="$4" p="$4" alignItems="center">
    //             <Button mb="$4" onPress={() => createUser("admin@mail.com", "1234", "admin", "ADMIN")}>Создать админа</Button>
    //             <Button mb="$4" onPress={() => createUser("alex@mail.com", "alex", "alex", "USER")}>Создать юзера A</Button>
    //             <Button mb="$4" onPress={() => createUser("jenya@mail.com", "1234", "jenya", "USER")}>Создать юзера J</Button>
    //             <Button mb="$4" onPress={() => createUser("efim@mail.com", "1234", "efim", "USER")}>Создать юзера E</Button>
    //             <Button mb="$4" onPress={() => createUser("mark@mail.com", "1234", "mark", "USER")}>Создать юзера M</Button>
    //             <Button mb="$4" onPress={() => createUser("nikita@mail.com", "1234", "nikita", "USER")}>Создать юзера N</Button>
    //             <Button mb="$4" onPress={() => createUser("matvey@mail.com", "1234", "matvey", "USER")}>Создать юзера M</Button>
    //             <H2>Панель администратора</H2>
    //             <Paragraph>Список всех пользователей системы:</Paragraph>
    //         </YStack>
    //         <UserList />
    //     </>
    // )

}