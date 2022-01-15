export interface KeyDeathData {
    player: string;
    killer?: string;
    item?: string;
}

export interface DeathData extends KeyDeathData {
    message: string;
}
