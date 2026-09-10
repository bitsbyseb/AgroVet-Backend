export class LoginUserUseCase {
    userRepository;
    passwordHasher;
    tokenService;
    emailService;
    constructor(userRepository, passwordHasher, tokenService, emailService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
        this.emailService = emailService;
    }
    async execute(request) {
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new Error('Invalid Credentials');
        }
        const isValid = await this.passwordHasher.compare(request.password, user.password);
        if (!isValid) {
            throw new Error('Invalid Credentials');
        }
        const currentDate = new Date();
        await this.emailService.send({
            to: request.email,
            subject: "Alerta de Seguridad: Nuevo Inicio de Sesion",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #2d6a4f; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">🐄 AgroVet</h1>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #2d6a4f;">Nuevo inicio de sesión detectado</h2>
    <p style="color: #555;">Hola <strong>${user.username}</strong>, se ha detectado un nuevo acceso a tu cuenta.</p>

    <div style="background-color: #f0f7f4; border-left: 4px solid #2d6a4f; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #555; font-weight: bold;">Detalles del acceso:</p>
      <p style="margin: 8px 0 0; color: #555;">📅 <strong>Fecha:</strong> ${currentDate.toLocaleDateString()}</p>
      <p style="margin: 4px 0 0; color: #555;">🕐 <strong>Hora:</strong> ${currentDate.getHours()}:${currentDate.getMinutes()}</p>
    </div>

    <p style="color: #555;">Si fuiste tú, puedes ignorar este mensaje.</p>

    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #856404;">
        ⚠️ Si <strong>no reconoces</strong> este acceso, contacta al administrador inmediatamente.
      </p>
    </div>

    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
      Este es un correo automático, por favor no respondas a este mensaje.
    </p>
  </div>
</div>
            `
        });
        return await this.tokenService.generateToken({
            sub: user.id,
            role: user.role,
        });
    }
}
