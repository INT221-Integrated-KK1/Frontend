import router from '../router/index.js'

async function getItems(url) {
  try {
    const data = await fetch(url)
    const items = await data.json()
    return items
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function getItemById(url, id) {
  try {
    const data = await fetch(`${url}/${id}`);
    if (data.ok) {
      const item = await data.json();
      return item;
    } else {
      // 404 error
      if (data.status === 404) {
        //window.alert('The requested task does not exist');
         router.go(-1);
      }
      // other errors
      console.error(`Error fetching task details: ${data.status}`);
      return undefined;
    }
  } catch (error) {
    console.error(`Error fetching task details: ${error}`);
    return undefined;
  }
}

async function deleteItemById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    return res.status
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...newItem
      })
    })
    const addedItem = await res.json()
    return addedItem
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function editItem(url, id, editItem) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...editItem,
      }),
    });
    const editedItem = await res.json(); 
    return editedItem;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function deleteAndTransfer(url, id, transferId) {
  try {
    const response = await fetch(`${url}/${id}/${transferId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete and transfer item: ${response.status}`);
    }
    return response.status; // Assuming you only need the status code
  } catch (error) {
    console.log(error);
  }
}
export { getItems, getItemById, deleteItemById, addItem, editItem, deleteAndTransfer };
