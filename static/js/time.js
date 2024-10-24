export function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Show '12' for hour '0'

    return `${hours}:${minutes}:${seconds} ${ampm}`;
}
