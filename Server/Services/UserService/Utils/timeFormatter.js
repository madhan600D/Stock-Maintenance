export const TimeFormatter = (time) => {
    const now = new Date(time);

    const shortFormat = now.toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short'
    });

    return shortFormat
}