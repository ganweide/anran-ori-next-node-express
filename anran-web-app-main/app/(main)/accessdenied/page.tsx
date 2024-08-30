"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function AccessDenied() {

    const router = useRouter();


    return (
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                AccessDenied, Contact Admin.
            </span>
            <Button icon="pi pi-arrow-left" label={'Dashboard'} className="mr-2" onClick={() => router.push("/dashboard")} />

        </div >

    );
}
