export const ValidAdminPassword = (secret: string | undefined): boolean => {
    const { ADMIN_SECRET } = process.env;
    if (!ADMIN_SECRET || !secret) {
        return false;
    }
    if (secret != ADMIN_SECRET) {
        return false;
    }
    return true;
};
