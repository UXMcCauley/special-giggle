export const memory = {
    log: [] as string[],
    add(entry: string) {
        this.log.push(entry);
    },
    history() {
        return this.log.slice(-5); // last 5 interactions
    }
};