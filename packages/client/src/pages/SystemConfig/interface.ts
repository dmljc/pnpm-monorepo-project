export interface CreateSystemConfig {
    logo: string;
    name: string;
    description: string;
    copyright: string;
    icp: string;
}

export interface UpdateSystemConfig extends CreateSystemConfig {
    id: number;
}
