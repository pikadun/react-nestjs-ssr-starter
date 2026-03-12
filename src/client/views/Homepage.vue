<template>
    <section style="display: grid; place-items: center; min-height: 100vh; text-align: center">
        <div>
            <h1>Rsbuild with Vue</h1>
            <p>Start building amazing things with Rsbuild.</p>
            <Button label="进入 Todo 页面" @click="goToTodo" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { AppRouteName } from "@shared/routes";
import { useRouter } from "vue-router";

defineOptions({
    name: "HomepageView",
});

const router = useRouter();

const goToTodo = async () => {
    await router.push({ name: AppRouteName.Todo });
};
</script>
