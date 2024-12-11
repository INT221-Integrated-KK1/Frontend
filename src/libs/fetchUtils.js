import router from "../router/index.js";

async function getItems(url) {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.ok) {
      const items = await response.json();
      return items;
    } else {
      console.error(`Error fetching items: ${response.status}`);
      const items = await response.json();
      return items;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function getItemById(url, id) {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${url}/${id}`, {
      method: "GET",
      headers,
    });

    if (response.ok) {
      const item = await response.json();
      return item;
    } else {
      console.error(`Error fetching item details: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching item details: ${error}`);
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
    if (res.ok) {
      return res.status;
    }
  } catch (error) {
    console.error(`error: ${error}`);
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
    let addedItem;
    try {
      addedItem = await res.json();
    } catch (error) {
      addedItem = res;
    }
    return addedItem;
  } catch (error) {
    console.error(`error: ${error}`);
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
    // }
  } catch (error) {
    console.error(`error: ${error}`);
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
    if (response.ok) {
      return response.status;
    } else {
      console.error(`Error fetching items: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
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
    const response = await res.json();
    if (response.status === 401) {
      localStorage.clear();
      router.push("/login");
    }

    return response;
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

async function addToken(url) {
  const refreshToken = localStorage.getItem("refresh_token");
  const token = localStorage.getItem("token");

  if (!refreshToken) {
    console.error("Refresh token is missing in localStorage.");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
        "x-refresh-token": `${refreshToken}`,
      },
    });
    const response = await res.json();

    return response;
  } catch (error) {
    console.error(`Error while refreshing token: ${error}`);
  }
}

async function changeBoardVisibility(url, id, visibility) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        visibility: visibility,
      }),
    });
    return res;
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

const editPatchItem = async (url, editItem) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${url}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        ...editItem,
      }),
    });
    if (res.ok) {
      const editedItem = await res.json();
      return editedItem;
    }
  } catch (error) {
    console.error(`error: ${error}`);
  }
};

const getFileImage = async (url, id, fileName) => {
  try {
    const response = await fetch(`${url}/${id}/${fileName}`, {
      method: "GET",
    });
    if (response.ok) {
      const file = await response.blob();
      return file;
    }
  } catch (error) {
    console.error(`Error fetching file: ${error}`);
  }
};

export {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  deleteAndTransfer,
  isAuthenticated,
  addToken,
  changeBoardVisibility,
  editPatchItem,
  getFileImage,
};
