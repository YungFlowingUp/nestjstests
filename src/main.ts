import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";

// Функция, запускающая сервер
async function bootstrap() {
    const PORT = process.env.PORT ?? 5000; 
    const app = await NestFactory.create(AppModule);

    // Запуск сервера
    await app.listen(PORT, () => console.log(`Server started working on PORT: ${PORT}`))

    // Создание ролей (админ, пользователь)
    // Создание первого админа
    // Функции выполняются сразу полсе запуска всех компонентов сервера
    const authService = app.get(AuthService);
    await authService.initializeRolesAndAdmin();
}

bootstrap()