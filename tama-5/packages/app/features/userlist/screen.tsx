'use client'
import { YStack,SizableText,Button } from "tamagui"
import { useRouter } from "solito/navigation"
import { useEffect,useState } from "react"
import { Platform } from "react-native"
import * as Haptics from "expo-haptics"
import { getBaseUrl } from "app/utils/util"
import { XStack } from "tamagui"
interface User{
    id: number;
    name:string;
    email:string;
    role:string;
}
export function UsersListScreen(){
    const { back } = useRouter();
    const [users,setUsers] = useState<User[] | null>();
    const [isLoading,setLoading] = useState(true);
    const handlePress = async () => {
        if (Platform.OS !== "web"){
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
            } catch (e){
                alert("Вибрация не поддерживается")
            }
        }
    }
    const [mounted,setMounted] = useState(false)
    useEffect(()=>{
        setMounted(true)
    })
    useEffect(()=>{
        const getUsers = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/api/users`)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json();
                setUsers(data.users)
            } catch (error) {
                console.log(error)
            } finally{
                setLoading(false)
            }
        }
        getUsers()
    },[])

    if (!mounted) return null
    if (isLoading) return <SizableText>Loading...</SizableText>
    return (
        <YStack backgroundColor="$background" height="100vh" width="100vw" f={1} jc="center" ai="center" bg="$background" gap="$4">
            {
            users?.map(u=>{
                    return(
                    <YStack key={u.id}>
                     <SizableText>id: {u.id}</SizableText>
                     <SizableText>name: {u.name}</SizableText>
                     <SizableText>email: {u.email}</SizableText>
                     <SizableText>role: {u.role}</SizableText>
                    </YStack>
                    )
                 })
            }
            <Button onPress={()=>{
                handlePress();
                back()
            }}>
                Назад
            </Button>
        </YStack>
    )
}