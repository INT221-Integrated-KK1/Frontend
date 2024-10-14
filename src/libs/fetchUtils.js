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
    if (response.status === 401) {
      localStorage.clear();
      router.push("/login");
      console.error(`Error fetching items: ${response.status}`);
    } else if (response.status === 403) {
      router.push({ name: "Forbidden" });
    } else if (response.ok) {
      const items = await response.json();
      return items;
    }
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
      } else if (data.status === 401) {
        localStorage.clear();
        router.push("/login");
        console.error(`Error fetching task details: ${data.status}`);
      } else if (data.status === 403) {
        router.push({ name: "Forbidden" });
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
    if (res.status === 401) {
      localStorage.clear();
      router.push("/login");
      console.error(`Error fetching items: ${response.status}`);
    } else if (res.status === 403) {
      router.push({ name: "Forbidden" });
    } else if (res.ok) {
      return res.status;
    }
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

    if (res.status === 401) {
      localStorage.clear();
      router.push("/login");
      console.error(`Error fetching items: ${response.status}`);
    } else if (res.status === 403) {
      router.push({ name: "Forbidden" });
    } else if (res.ok) {
      const addedItem = await res.json();
      return addedItem;
    }
  } catch (error) {
    console.log(`error: ${error}`);
    return { status: 401, message: "Unauthorized" };
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
    if (res.status === 401) {
      localStorage.clear();
      router.push("/login");
    } else if (res.status === 403) {
      router.push({ name: "Forbidden" });
    } else if (res.ok) {
      const editedItem = await res.json();
      return editedItem;
    }
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
    if (response.status === 401) {
      localStorage.clear();
      router.push("/login");
    } else if (res.status === 403) {
      router.push({ name: "Forbidden" });
    } else if (res.ok) {
      return response.status;
    } else {
      console.error(`Error fetching items: ${response.status}`);
    }
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
    const response = await res.json();
    if (response.status === 401) {
      localStorage.clear();
      router.push("/login");
    } else if (res.status === 403) {
      router.push({ name: "Forbidden" });
    }
    return response;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addToken(url) {
  const refreshToken = localStorage.getItem("refresh_token");
  const token = localStorage.getItem("token");

  if (!refreshToken) {
    console.error("Refresh token is missing in localStorage.");
    return;
  }
  console.log("Sending refresh token:", refreshToken);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
        "x-refresh-token": `${refreshToken}` ,
      },
    });
    const response = await res.json();
    if (response.status === 403) {
      router.push({ name: "Forbidden" });
    }

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
    if (res.status === 403) {
      router.push({ name: "Forbidden" });
    }
    return res;
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
  addToken,
  changeBoardVisibility,
};
