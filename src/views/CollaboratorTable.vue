<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getItemById } from "@/libs/fetchUtils";
import Sidebar from "@/components/Sidebar.vue";
import AddCollabModal from "@/components/modals/board/AddCollabModal.vue";


const notOwner = ref(false);
const { params } = useRoute();
const boardId = params.boardId;
const board = ref([]);

onMounted(async () => {
    try {
        const boardItem = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
        board.value = boardItem;
        console.log(board);
        console.log(board.value.name);


    } catch (error) {
        console.error("Error fetching task details:", error)
    }
})

</script>

<template>

    <div class="flex">
        <div>
            <Sidebar />
        </div>

        <div class="w-screen">
            <h1 class="text-4xl text-center font-bold mt-10">Collaborator Management</h1>
            <!-- filter -->
            <div class="flex justify-between mx-52 mt-5 items-center ">
                <div class="flex justify-items-center ">
                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <span class="mx-2 font-semibold text-teal-700">{{ board.name }} </span>
                    </RouterLink>
                    <span class="font-semibold">> Collaborator</span>

                </div>

                <div class=" flex">
                    <AddCollabModal :boardId="boardId" :notOwner="notOwner"/>
                   
                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <div class="btn ">Back to Board</div>
                    </RouterLink>

                </div>
            </div>

            <!-- table -->

            <div class="flex justify-center ">
                <table class="table w-3/4 mt-5 border-solid border-2 rounded-m border-black">
                    <thead>
                        <tr class="bg-orange-200 
         border-solid border-2 border-black text-xl text-black">
                            <th class="font-bold text-center">No</th>
                            <th class="font-bold">Name</th>
                            <th class="font-bold">E-mail</th>
                            <th class="font-bold">Access Right</th>
                            <th class="font-bold">Action</th>


                        </tr>
                    </thead>
                    <tbody>
                        <tr class="h-16 border-solid border-2 border-black">
                            <td class="font-semibold text-center">1</td>
                            <td class="">Name Last</td>
                            <td class="">Email@gmail.com</td>
                            <td class="">
                                <select class="select select-bordered w-full max-w-xs">
                                    <option selected>READ</option>
                                    <option>WRITE</option>
                                </select>
                            </td>
                            <td>
                                <button class="btn btn-outline btn-error">Remove</button>

                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>



<style scoped>
.itbkk-button-action:hover svg {
    fill: #007bff;
    cursor: pointer;
}
</style>