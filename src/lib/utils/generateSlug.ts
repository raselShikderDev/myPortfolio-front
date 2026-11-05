export const generateSlug = (title: string): string => {
    return title
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/%/g, ' percent ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};