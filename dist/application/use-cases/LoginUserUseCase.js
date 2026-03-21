export class LoginUserUseCase {
    userRepository;
    passwordHasher;
    tokenService;
    constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
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
        return await this.tokenService.generateToken({
            sub: user.id,
            role: user.role,
        });
    }
}
