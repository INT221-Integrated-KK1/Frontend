import router from "../router/index.js";

async function getItems(url) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const items = await response.json();
    return items;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
async function getItemById(url, id) {
  try {
    const token = localStorage.getItem("token");
    const data = await fetch(`${url}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addItem(url, newItem) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...newItem,
      }),
    });
    const addedItem = await res.json();
    return addedItem;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function editItem(url, id, editItem) {
  
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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
  
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${url}/${id}/${transferId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete and transfer item: ${response.status}`);
    }
    return response.status; // Assuming you only need the status code
  } catch (error) {
    console.log(error);
  }
}
async function isAuthenticated(url, input) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...input,
      }),
    });
    const response = await  res.json();
    console.log("response " + response);
    return response;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}


export {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  deleteAndTransfer,
  isAuthenticated,
};
