import { User, UserRole } from '@domain/entities/User.js';
import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { EmailService } from '@domain/services/EmailService.js';
import type { PasswordHasher } from '@domain/services/PasswordHasher.js';
import { randomUUID } from 'node:crypto';

export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export class RegisterUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private emailService: EmailService
    ) { }

    async execute(request: RegisterUserRequest): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new Error('User is already in the system');
        }

        const hashedPassword = await this.passwordHasher.hash(request.password);

        if (request.role === UserRole.ADMIN) {
            throw new Error('Unauthorized: Cannot create users with Administrator role');
        }

        const newUser = new User({
            id: randomUUID(),
            username: request.username,
            email: request.email,
            password: hashedPassword,
            role: request.role,
        });

        await this.userRepository.save(newUser);

        await this.emailService.send({
            to: request.email,
            subject: "Creacion de Cuenta Exitosa - Agrovet",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #2d6a4f; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">🐄 AgroVet</h1>
  </div>
  
  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #2d6a4f;">¡Bienvenido a AgroVet!</h2>
    <p style="color: #555;">Hola <strong>${request.username}</strong>, tu cuenta ha sido creada exitosamente.</p>
    
    <div style="background-color: #f0f7f4; border-left: 4px solid #2d6a4f; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #555;">Tus credenciales de acceso:</p>
      <p style="margin: 8px 0 0;"><strong>Email:</strong> ${request.email}</p>
    </div>

    <p style="color: #555;">Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/login" 
         style="background-color: #2d6a4f; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
        Iniciar sesión
      </a>
    </div>

    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
      Si no esperabas este correo, ignóralo o contacta al administrador.
    </p>
  </div>
</div>`
        });
    }
}
