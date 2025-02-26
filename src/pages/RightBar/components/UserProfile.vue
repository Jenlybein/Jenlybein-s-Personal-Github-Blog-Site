<template>
    <div class="profile-container">
        <img class="profile-image" src="https://avatars.githubusercontent.com/u/149927588?v=4" alt="Profile Picture" />
        <h3>Jenlybein</h3>
        <p>目前是深圳技术大学的一名本科生，正在努力学习。</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.profile-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.profile-image {
    width: 80px;
    height: 80px;
    margin: 20px;
    box-shadow: 0px 0px 20px #000000a1;
    border-radius: 50%;
    transition: transform 0.5s;
}

.profile-image:hover {
    transform: rotate(360deg)
}
</style>