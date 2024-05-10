<script setup>

</script>

<template>
    <div class="flex justify-end mr-52">
        <RouterLink :to="{ name: 'task' }">
            <div class="btn mt-">Home</div>
        </RouterLink>
    </div>
    <!-- demo table -->
    <div class="overflow-x-auto flex justify-center">
        <table class="table w-3/4 mt-10 rounded-lg border-solid border-2 border-black">
            <!-- head -->
            <thead>
                <tr class="bg-pink-300  rounded-lg border-solid border-2 border-black text-xl text-black">
                    <th class=""></th>
                    <th class="font-bold">Name</th>
                    <th class="font-bold">Description</th>
                    <th class="font-bold">Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- row 1 -->
                <tr class=" rounded-lg border-solid border-2 border-black">
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td><button class="btn mr-5">edit</button>
                        <button class="btn">delete</button>
                    </td>
                </tr>
                <!-- row 2 -->
                <tr class="rounded-lg border-solid border-2 border-black">
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td><button class="btn mr-5">edit</button>
                        <button class="btn">delete</button>
                    </td>
                </tr>
                <!-- row 3 -->
                <tr class="">
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td><button class="btn mr-5">edit</button>
                        <button class="btn">delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>