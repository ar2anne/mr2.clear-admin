export default function fullTextSearch(items:any[], text:any) {
    text = text.split(' ');
    return items.filter(item => {
        return text.every((el:any) => {
            return item.mName.toLowerCase().includes(el.toLowerCase());
        });
    });
}