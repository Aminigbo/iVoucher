if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/aminigbo/.gradle/caches/8.10.2/transforms/7fa963dacf0b8de93bbf2ba1099122a8/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/aminigbo/.gradle/caches/8.10.2/transforms/7fa963dacf0b8de93bbf2ba1099122a8/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

