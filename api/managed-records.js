import URI from "urijs";

//records endpoint
window.path = "http://localhost:3000/records";
const path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const retrieve = async (options = {}) => {
    if (window.path !== path) {
        console.log(`you have entered a wrong path ${window.path}`)
        return;
    }
    const { page = 1, colors = [] } = options;
    const limit = 10;
    const offset = (page - 1) * limit;
    const url = URI(path).search({ limit, offset, 'color[]': colors })
    const response = await fetch(url);
    const data = await response.json();
    const ids = data.map(item => item.id);
    const open = data.filter(item => item.disposition === 'open').map(item => {
        const isPrimary = ['red', 'blue', 'yellow'].includes(item.color);
        return { ...item, isPrimary };
    });
    const closedPrimaryCount = data.filter(
        item => item.disposition === 'closed'
            && ['red', 'blue', 'yellow'].includes(item.color)
    ).length;
    const previousPage = page > 1 ? page - 1 : null;
    //const nextPage = data.length < limit || page >= 50 ? null : page + 1;
    const checkIfNextPage = async () => {
        if (data.length === 0) return null;
        let res = await fetch(path + `?limit=1&offset=${offset + 10}`);
        res = await res.json();
        return res.length > 0;
    }
    const nextPage = await checkIfNextPage() ? page + 1 : null;
    return { ids, open, closedPrimaryCount, previousPage, nextPage };
};
export default retrieve;
